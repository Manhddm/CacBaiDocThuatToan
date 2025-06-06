# Phương trình Diophantine tuyến tính

## Định nghĩa

Phương trình Diophantine tuyến tính (với hai ẩn) là phương trình có dạng tổng quát:

$$ax + by = c$$

trong đó $a$, $b$, $c$ là các số nguyên đã cho, và $x$, $y$ là các số nguyên chưa biết.

Trong bài viết này, chúng ta xem xét một số bài toán cổ điển về những phương trình này:

• Tìm một nghiệm
• Tìm tất cả các nghiệm
• Tìm số lượng nghiệm và các nghiệm trong một khoảng cho trước
• Tìm nghiệm có giá trị $x + y$ nhỏ nhất

## Trường hợp suy biến

Một trường hợp suy biến cần được xử lý đặc biệt là khi $a = b = 0$. Ta dễ dàng thấy rằng ta hoặc không có nghiệm hoặc có vô số nghiệm, tùy thuộc vào $c = 0$ hay không. Trong phần còn lại của bài viết này, chúng ta sẽ bỏ qua trường hợp này.

## Giải pháp phân tích

Khi $a \neq 0$ và $b \neq 0$, phương trình $ax+by=c$ có thể được xem tương đương với một trong hai phương trình sau:

$$\begin{align} 
ax &\equiv c \pmod b \\ 
by &\equiv c \pmod a 
\end{align}$$

Không mất tính tổng quát, giả sử $b \neq 0$ và xét phương trình đầu tiên. Khi $a$ và $b$ nguyên tố cùng nhau, nghiệm của nó được cho bởi:

$$x \equiv ca^{-1} \pmod b,$$

trong đó $a^{-1}$ là [nghịch đảo modular](https://cp-algorithms.com/algebra/module-inverse.html) của $a$ modulo $b$.

Khi $a$ và $b$ không nguyên tố cùng nhau, các giá trị của $ax$ modulo $b$ với mọi số nguyên $x$ đều chia hết cho $g=\gcd(a, b)$, do đó nghiệm chỉ tồn tại khi $c$ chia hết cho $g$. Trong trường hợp này, một trong các nghiệm có thể được tìm bằng cách rút gọn phương trình cho $g$:

$$(a/g) x \equiv (c/g) \pmod{b/g}.$$

Theo định nghĩa của $g$, các số $a/g$ và $b/g$ nguyên tố cùng nhau, do đó nghiệm được cho rõ ràng là:

$$\begin{cases} 
x \equiv (c/g)(a/g)^{-1}\pmod{b/g},\\ 
y = \frac{c-ax}{b}.
\end{cases}$$

## Giải pháp thuật toán

Bổ đề Bézout (còn gọi là đẳng thức Bézout) là một kết quả hữu ích có thể được sử dụng để hiểu giải pháp sau đây.

> Cho $g = \gcd(a,b)$. Thì tồn tại các số nguyên $x,y$ sao cho $ax + by = g$.
>
> Hơn nữa, $g$ là số nguyên dương nhỏ nhất có thể viết dưới dạng $ax + by$; tất cả các số nguyên có dạng $ax + by$ đều là bội của $g$.

Để tìm một nghiệm của phương trình Diophantine với 2 ẩn, bạn có thể sử dụng [thuật toán Euclid mở rộng](https://cp-algorithms.com/algebra/extended-euclid-algorithm.html). Đầu tiên, giả sử $a$ và $b$ không âm. Khi ta áp dụng thuật toán Euclid mở rộng cho $a$ và $b$, ta có thể tìm ước chung lớn nhất $g$ của chúng và 2 số $x_g$ và $y_g$ sao cho:

$$a x_g + b y_g = g$$

Nếu $c$ chia hết cho $g = \gcd(a, b)$, thì phương trình Diophantine đã cho có nghiệm, ngược lại nó không có nghiệm nào. Chứng minh rất đơn giản: một tổ hợp tuyến tính của hai số chia hết cho ước chung của chúng.

Bây giờ giả sử $c$ chia hết cho $g$, thì ta có:

$$a \cdot x_g \cdot \frac{c}{g} + b \cdot y_g \cdot \frac{c}{g} = c$$

Do đó một trong các nghiệm của phương trình Diophantine là:

$$x_0 = x_g \cdot \frac{c}{g},$$ 
$$y_0 = y_g \cdot \frac{c}{g}.$$

Ý tưởng trên vẫn hoạt động khi $a$ hoặc $b$ hoặc cả hai đều âm. Ta chỉ cần thay đổi dấu của $x_0$ và $y_0$ khi cần thiết.

Cuối cùng, ta có thể cài đặt ý tưởng này như sau (lưu ý rằng mã này không xem xét trường hợp $a = b = 0$):

```cpp
int gcd(int a, int b, int& x, int& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    int x1, y1;
    int d = gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - y1 * (a / b);
    return d;
}

bool find_any_solution(int a, int b, int c, int &x0, int &y0, int &g) {
    g = gcd(abs(a), abs(b), x0, y0);
    if (c % g) {
        return false;
    }

    x0 *= c / g;
    y0 *= c / g;
    if (a < 0) x0 = -x0;
    if (b < 0) y0 = -y0;
    return true;
}
```

**Python:**
```python
def extended_gcd(a, b):
    """Thuật toán Euclid mở rộng"""
    if b == 0:
        return a, 1, 0
    gcd, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return gcd, x, y

def find_any_solution(a, b, c):
    """Tìm một nghiệm của phương trình ax + by = c"""
    g, x0, y0 = extended_gcd(abs(a), abs(b))
    
    if c % g != 0:
        return None  # Không có nghiệm
    
    x0 *= c // g
    y0 *= c // g
    
    if a < 0:
        x0 = -x0
    if b < 0:
        y0 = -y0
    
    return x0, y0, g
```

## Tìm tất cả các nghiệm

Từ một nghiệm $(x_0, y_0)$, ta có thể thu được tất cả các nghiệm của phương trình đã cho.

Cho $g = \gcd(a, b)$ và cho $x_0, y_0$ là các số nguyên thỏa mãn:

$$a \cdot x_0 + b \cdot y_0 = c$$

Bây giờ, ta nên thấy rằng việc cộng $b / g$ vào $x_0$, và đồng thời trừ $a / g$ từ $y_0$ sẽ không phá vỡ đẳng thức:

$$a \cdot \left(x_0 + \frac{b}{g}\right) + b \cdot \left(y_0 - \frac{a}{g}\right) = a \cdot x_0 + b \cdot y_0 + a \cdot \frac{b}{g} - b \cdot \frac{a}{g} = c$$

Rõ ràng, quá trình này có thể được lặp lại, vì vậy tất cả các số có dạng:

$$x = x_0 + k \cdot \frac{b}{g}$$ 
$$y = y_0 - k \cdot \frac{a}{g}$$

đều là nghiệm của phương trình Diophantine đã cho.

Vì phương trình là tuyến tính, tất cả các nghiệm nằm trên cùng một đường thẳng, và theo định nghĩa của $g$, đây là tập hợp tất cả các nghiệm có thể có của phương trình Diophantine đã cho.

## Tìm số lượng nghiệm và các nghiệm trong một khoảng cho trước

Từ phần trước, rõ ràng là nếu ta không đặt bất kỳ hạn chế nào lên các nghiệm, sẽ có vô số nghiệm. Vì vậy trong phần này, ta thêm một số hạn chế về khoảng của $x$ và $y$, và ta sẽ cố gắng đếm và liệt kê tất cả các nghiệm.

Cho có hai khoảng: $[min_x; max_x]$ và $[min_y; max_y]$ và giả sử ta chỉ muốn tìm các nghiệm trong hai khoảng này.

Lưu ý rằng nếu $a$ hoặc $b$ bằng $0$, thì bài toán chỉ có một nghiệm. Ta không xem xét trường hợp này ở đây.

Đầu tiên, ta có thể tìm một nghiệm có giá trị $x$ nhỏ nhất, sao cho $x \ge min_x$. Để làm điều này, ta trước tiên tìm bất kỳ nghiệm nào của phương trình Diophantine. Sau đó, ta dịch chuyển nghiệm này để có $x \ge min_x$ (sử dụng những gì ta biết về tập hợp tất cả các nghiệm trong phần trước). Điều này có thể được thực hiện trong $O(1)$. Ký hiệu giá trị nhỏ nhất này của $x$ là $l_{x1}$.

Tương tự, ta có thể tìm giá trị lớn nhất của $x$ thỏa mãn $x \le max_x$. Ký hiệu giá trị lớn nhất này của $x$ là $r_{x1}$.

Tương tự, ta có thể tìm giá trị nhỏ nhất của $y$ $(y \ge min_y)$ và giá trị lớn nhất của $y$ $(y \le max_y)$. Ký hiệu các giá trị $x$ tương ứng là $l_{x2}$ và $r_{x2}$.

Nghiệm cuối cùng là tất cả các nghiệm với $x$ trong giao của $[l_{x1}, r_{x1}]$ và $[l_{x2}, r_{x2}]$. Ký hiệu giao này là $[l_x, r_x]$.

Dưới đây là mã cài đặt ý tưởng này. Lưu ý rằng ta chia $a$ và $b$ ngay từ đầu cho $g$. Vì phương trình $a x + b y = c$ tương đương với phương trình $\frac{a}{g} x + \frac{b}{g} y = \frac{c}{g}$, ta có thể sử dụng phương trình này thay thế và có $\gcd(\frac{a}{g}, \frac{b}{g}) = 1$, điều này đơn giản hóa các công thức.

```cpp
void shift_solution(int & x, int & y, int a, int b, int cnt) {
    x += cnt * b;
    y -= cnt * a;
}

int find_all_solutions(int a, int b, int c, int minx, int maxx, int miny, int maxy) {
    int x, y, g;
    if (!find_any_solution(a, b, c, x, y, g))
        return 0;
    a /= g;
    b /= g;

    int sign_a = a > 0 ? +1 : -1;
    int sign_b = b > 0 ? +1 : -1;

    shift_solution(x, y, a, b, (minx - x) / b);
    if (x < minx)
        shift_solution(x, y, a, b, sign_b);
    if (x > maxx)
        return 0;
    int lx1 = x;

    shift_solution(x, y, a, b, (maxx - x) / b);
    if (x > maxx)
        shift_solution(x, y, a, b, -sign_b);
    int rx1 = x;

    shift_solution(x, y, a, b, -(miny - y) / a);
    if (y < miny)
        shift_solution(x, y, a, b, -sign_a);
    if (y > maxy)
        return 0;
    int lx2 = x;

    shift_solution(x, y, a, b, -(maxy - y) / a);
    if (y > maxy)
        shift_solution(x, y, a, b, sign_a);
    int rx2 = x;

    if (lx2 > rx2)
        swap(lx2, rx2);
    int lx = max(lx1, lx2);
    int rx = min(rx1, rx2);

    if (lx > rx)
        return 0;
    return (rx - lx) / abs(b) + 1;
}
```

**Python:**
```python
def shift_solution(x, y, a, b, cnt):
    """Dịch chuyển nghiệm"""
    return x + cnt * b, y - cnt * a

def find_all_solutions(a, b, c, min_x, max_x, min_y, max_y):
    """Tìm số lượng nghiệm trong khoảng cho trước"""
    result = find_any_solution(a, b, c)
    if result is None:
        return 0
    
    x, y, g = result
    a //= g
    b //= g
    
    sign_a = 1 if a > 0 else -1
    sign_b = 1 if b > 0 else -1
    
    # Tìm khoảng x dựa trên ràng buộc min_x, max_x
    x, y = shift_solution(x, y, a, b, (min_x - x) // b)
    if x < min_x:
        x, y = shift_solution(x, y, a, b, sign_b)
    if x > max_x:
        return 0
    lx1 = x
    
    x, y = shift_solution(x, y, a, b, (max_x - x) // b)
    if x > max_x:
        x, y = shift_solution(x, y, a, b, -sign_b)
    rx1 = x
    
    # Tìm khoảng x dựa trên ràng buộc min_y, max_y
    x, y = shift_solution(x, y, a, b, -(min_y - y) // a)
    if y < min_y:
        x, y = shift_solution(x, y, a, b, -sign_a)
    if y > max_y:
        return 0
    lx2 = x
    
    x, y = shift_solution(x, y, a, b, -(max_y - y) // a)
    if y > max_y:
        x, y = shift_solution(x, y, a, b, sign_a)
    rx2 = x
    
    if lx2 > rx2:
        lx2, rx2 = rx2, lx2
    
    lx = max(lx1, lx2)
    rx = min(rx1, rx2)
    
    if lx > rx:
        return 0
    
    return (rx - lx) // abs(b) + 1
```

Một khi ta có $l_x$ và $r_x$, việc liệt kê qua tất cả các nghiệm cũng đơn giản. Chỉ cần lặp qua $x = l_x + k \cdot \frac{b}{g}$ với mọi $k \ge 0$ cho đến khi $x = r_x$, và tìm các giá trị $y$ tương ứng bằng phương trình $a x + b y = c$.

## Tìm nghiệm có giá trị $x + y$ nhỏ nhất

Ở đây, $x$ và $y$ cũng cần được đặt một số hạn chế, nếu không, đáp án có thể trở thành âm vô cực.

Ý tưởng tương tự như phần trước: Ta tìm bất kỳ nghiệm nào của phương trình Diophantine, sau đó dịch chuyển nghiệm để thỏa mãn một số điều kiện.

Cuối cùng, sử dụng kiến thức về tập hợp tất cả các nghiệm để tìm giá trị nhỏ nhất:

$$x' = x + k \cdot \frac{b}{g},$$ 
$$y' = y - k \cdot \frac{a}{g}.$$

Lưu ý rằng $x + y$ thay đổi như sau:

$$x' + y' = x + y + k \cdot \left(\frac{b}{g} - \frac{a}{g}\right) = x + y + k \cdot \frac{b-a}{g}$$

Nếu $a < b$, ta cần chọn giá trị $k$ nhỏ nhất có thể. Nếu $a > b$, ta cần chọn giá trị $k$ lớn nhất có thể. Nếu $a = b$, tất cả nghiệm sẽ có cùng tổng $x + y$.

## Bài tập thực hành

• [Spoj - Crucial Equation](http://www.spoj.com/problems/CEQU/)
• [SGU 106](http://codeforces.com/problemsets/acmsguru/problem/99999/106)
• [Codeforces - Ebony and Ivory](http://codeforces.com/contest/633/problem/A)
• [Codechef - Get AC in one go](https://www.codechef.com/problems/COPR16G)
• [LightOj - Solutions to an equation](http://www.lightoj.com/volume_showproblem.php?problem=1306)
• [Atcoder - F - S = 1](https://atcoder.jp/contests/abc340/tasks/abc340_f)

## Tài liệu tham khảo

Bài viết này được dịch từ [CP-Algorithms](https://cp-algorithms.com/algebra/linear-diophantine-equation.html) với các thuật ngữ chuyên ngành được dịch chính xác sang tiếng Việt.
