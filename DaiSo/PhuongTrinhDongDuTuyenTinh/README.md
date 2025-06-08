# Phương trình đồng dư tuyến tính (Linear Congruence Equation)

## Giới thiệu

Phương trình đồng dư tuyến tính có dạng:

$$a \cdot x \equiv b \pmod{n}$$

trong đó $a$, $b$ và $n$ là các số nguyên cho trước và $x$ là ẩn số nguyên cần tìm.

Yêu cầu là tìm giá trị $x$ trong khoảng $[0, n-1]$ (rõ ràng trên toàn bộ trục số có thể có vô số nghiệm khác nhau với mỗi nghiệm chênh lệch $n \cdot k$, trong đó $k$ là số nguyên bất kỳ). Nếu nghiệm không duy nhất, chúng ta sẽ xem xét cách tìm tất cả các nghiệm.

## Phương pháp 1: Giải bằng nghịch đảo modular

### Trường hợp 1: gcd(a, n) = 1

Xét trường hợp đơn giản hơn khi $a$ và $n$ nguyên tố cùng nhau ($\gcd(a, n) = 1$). Khi đó ta có thể tìm nghịch đảo của $a$ modulo $n$, và nhân cả hai vế của phương trình với nghịch đảo này để được nghiệm duy nhất:

$$x \equiv b \cdot a^{-1} \pmod{n}$$

### Trường hợp 2: gcd(a, n) > 1

Xét trường hợp khi $a$ và $n$ không nguyên tố cùng nhau ($\gcd(a, n) \neq 1$). Khi đó nghiệm không phải lúc nào cũng tồn tại (ví dụ $2 \cdot x \equiv 1 \pmod{4}$ vô nghiệm).

Đặt $g = \gcd(a, n)$ là ước chung lớn nhất của $a$ và $n$ (trong trường hợp này $g > 1$).

Nếu $b$ không chia hết cho $g$, thì phương trình vô nghiệm. Thực tế, với mọi $x$, vế trái của phương trình $a \cdot x \bmod n$ luôn chia hết cho $g$, trong khi vế phải không chia hết cho $g$, do đó không có nghiệm.

Nếu $g$ chia hết $b$, thì bằng cách chia cả hai vế của phương trình cho $g$ (tức là chia $a$, $b$ và $n$ cho $g$), ta nhận được phương trình mới:

$$a' \cdot x \equiv b' \pmod{n'}$$

trong đó $a' = a/g$, $b' = b/g$, $n' = n/g$ và $a'$ với $n'$ đã nguyên tố cùng nhau. Ta đã biết cách giải phương trình này. Gọi $x'$ là nghiệm tìm được.

Rõ ràng $x'$ cũng sẽ là nghiệm của phương trình ban đầu. Tuy nhiên đó không phải là nghiệm duy nhất. Có thể chứng minh rằng phương trình ban đầu có đúng $g$ nghiệm, và chúng có dạng:

$$x_i \equiv (x' + i \cdot n') \pmod{n} \quad \text{với } i = 0, 1, \ldots, g-1$$

Tóm lại, số nghiệm của phương trình đồng dư tuyến tính bằng $g = \gcd(a, n)$ hoặc bằng 0.

## Phương pháp 2: Giải bằng thuật toán Euclidean mở rộng

Ta có thể viết lại phương trình đồng dư thành phương trình Diophantine sau:

$$a \cdot x + n \cdot k = b$$

trong đó $x$ và $k$ là các ẩn số nguyên.

Phương pháp giải phương trình này được mô tả trong bài viết về phương trình Diophantine tuyến tính và sử dụng thuật toán Euclidean mở rộng.

Phương pháp này cũng mô tả cách tìm tất cả nghiệm từ một nghiệm đã tìm được, và về bản chất nó hoàn toàn tương đương với phương pháp đã mô tả ở phần trước.

## Triển khai code

### Phương pháp 1: Sử dụng nghịch đảo modular

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Tính gcd và các hệ số x, y sao cho ax + by = gcd(a, b)
long long extgcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long x1, y1;
    long long gcd = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return gcd;
}

// Tính nghịch đảo modular của a modulo m
long long modInverse(long long a, long long m) {
    long long x, y;
    long long gcd = extgcd(a, m, x, y);
    if (gcd != 1) return -1; // Không tồn tại nghịch đảo
    return (x % m + m) % m;
}

// Giải phương trình ax ≡ b (mod n)
vector<long long> solveLinearCongruence(long long a, long long b, long long n) {
    vector<long long> solutions;
    
    long long g = __gcd(a, n);
    
    // Kiểm tra có nghiệm hay không
    if (b % g != 0) {
        return solutions; // Vô nghiệm
    }
    
    // Rút gọn phương trình
    a /= g;
    b /= g;
    long long n_reduced = n / g;
    
    // Tìm nghịch đảo của a modulo n_reduced
    long long inv = modInverse(a, n_reduced);
    if (inv == -1) {
        return solutions; // Lỗi lý thuyết, không nên xảy ra
    }
    
    // Nghiệm cơ bản
    long long x0 = (b * inv) % n_reduced;
    
    // Tất cả nghiệm
    for (int i = 0; i < g; i++) {
        long long x = (x0 + i * n_reduced) % n;
        if (x < 0) x += n;
        solutions.push_back(x);
    }
    
    return solutions;
}

// Hàm kiểm tra nghiệm
bool checkSolution(long long a, long long x, long long b, long long n) {
    return (a * x) % n == b % n;
}

int main() {
    long long a, b, n;
    
    cout << "Nhập a, b, n cho phương trình ax ≡ b (mod n): ";
    cin >> a >> b >> n;
    
    vector<long long> solutions = solveLinearCongruence(a, b, n);
    
    if (solutions.empty()) {
        cout << "Phương trình vô nghiệm!" << endl;
    } else {
        cout << "Phương trình có " << solutions.size() << " nghiệm:" << endl;
        for (long long x : solutions) {
            cout << "x = " << x;
            if (checkSolution(a, x, b, n)) {
                cout << " (đúng)";
            } else {
                cout << " (sai)";
            }
            cout << endl;
        }
    }
    
    return 0;
}
```

### Phương pháp 2: Sử dụng thuật toán Euclidean mở rộng

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Thuật toán Euclidean mở rộng
long long extendedGCD(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long x1, y1;
    long long gcd = extendedGCD(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return gcd;
}

// Giải phương trình ax ≡ b (mod n) bằng phương pháp Euclidean mở rộng
vector<long long> solveLinearCongruenceExt(long long a, long long b, long long n) {
    vector<long long> solutions;
    
    long long x, y;
    long long g = extendedGCD(a, n, x, y);
    
    // Kiểm tra có nghiệm hay không
    if (b % g != 0) {
        return solutions; // Vô nghiệm
    }
    
    // Nghiệm cơ bản
    long long x0 = (x * (b / g)) % n;
    if (x0 < 0) x0 += n;
    
    // Khoảng cách giữa các nghiệm
    long long step = n / g;
    
    // Tất cả nghiệm
    for (int i = 0; i < g; i++) {
        long long sol = (x0 + i * step) % n;
        if (sol < 0) sol += n;
        solutions.push_back(sol);
    }
    
    return solutions;
}

int main() {
    long long a, b, n;
    
    cout << "Nhập a, b, n cho phương trình ax ≡ b (mod n): ";
    cin >> a >> b >> n;
    
    cout << "Phương pháp 1 (Nghịch đảo modular):" << endl;
    vector<long long> solutions1 = solveLinearCongruence(a, b, n);
    if (solutions1.empty()) {
        cout << "Vô nghiệm" << endl;
    } else {
        for (long long x : solutions1) {
            cout << "x = " << x << endl;
        }
    }
    
    cout << "\nPhương pháp 2 (Euclidean mở rộng):" << endl;
    vector<long long> solutions2 = solveLinearCongruenceExt(a, b, n);
    if (solutions2.empty()) {
        cout << "Vô nghiệm" << endl;
    } else {
        for (long long x : solutions2) {
            cout << "x = " << x << endl;
        }
    }
    
    return 0;
}
```

### Code Python

```python
def extended_gcd(a, b):
    """Thuật toán Euclidean mở rộng"""
    if b == 0:
        return a, 1, 0
    gcd, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return gcd, x, y

def mod_inverse(a, m):
    """Tính nghịch đảo modular của a modulo m"""
    gcd, x, y = extended_gcd(a, m)
    if gcd != 1:
        return None  # Không tồn tại nghịch đảo
    return (x % m + m) % m

def solve_linear_congruence(a, b, n):
    """
    Giải phương trình ax ≡ b (mod n)
    Trả về danh sách tất cả nghiệm trong [0, n-1]
    """
    import math
    
    g = math.gcd(a, n)
    
    # Kiểm tra có nghiệm hay không
    if b % g != 0:
        return []  # Vô nghiệm
    
    # Rút gọn phương trình
    a_reduced = a // g
    b_reduced = b // g
    n_reduced = n // g
    
    # Tìm nghịch đảo của a_reduced modulo n_reduced
    inv = mod_inverse(a_reduced, n_reduced)
    if inv is None:
        return []  # Lỗi lý thuyết, không nên xảy ra
    
    # Nghiệm cơ bản
    x0 = (b_reduced * inv) % n_reduced
    
    # Tất cả nghiệm
    solutions = []
    for i in range(g):
        x = (x0 + i * n_reduced) % n
        solutions.append(x)
    
    return sorted(solutions)

def solve_using_extended_gcd(a, b, n):
    """
    Giải phương trình ax ≡ b (mod n) bằng thuật toán Euclidean mở rộng
    """
    g, x, y = extended_gcd(a, n)
    
    # Kiểm tra có nghiệm hay không
    if b % g != 0:
        return []  # Vô nghiệm
    
    # Nghiệm cơ bản
    x0 = (x * (b // g)) % n
    if x0 < 0:
        x0 += n
    
    # Khoảng cách giữa các nghiệm
    step = n // g
    
    # Tất cả nghiệm
    solutions = []
    for i in range(g):
        sol = (x0 + i * step) % n
        solutions.append(sol)
    
    return sorted(solutions)

def check_solution(a, x, b, n):
    """Kiểm tra xem x có phải nghiệm của ax ≡ b (mod n) không"""
    return (a * x) % n == b % n

# Ví dụ sử dụng
if __name__ == "__main__":
    print("Giải phương trình đồng dư tuyến tính ax ≡ b (mod n)")
    
    # Test case 1: 3x ≡ 2 (mod 5)
    a, b, n = 3, 2, 5
    print(f"\nVí dụ 1: {a}x ≡ {b} (mod {n})")
    
    solutions1 = solve_linear_congruence(a, b, n)
    solutions2 = solve_using_extended_gcd(a, b, n)
    
    print(f"Phương pháp nghịch đảo: {solutions1}")
    print(f"Phương pháp Euclidean mở rộng: {solutions2}")
    
    for x in solutions1:
        print(f"Kiểm tra x = {x}: {a} * {x} ≡ {(a*x) % n} (mod {n}), đúng: {check_solution(a, x, b, n)}")
    
    # Test case 2: 6x ≡ 9 (mod 15)
    a, b, n = 6, 9, 15
    print(f"\nVí dụ 2: {a}x ≡ {b} (mod {n})")
    
    solutions1 = solve_linear_congruence(a, b, n)
    solutions2 = solve_using_extended_gcd(a, b, n)
    
    print(f"Phương pháp nghịch đảo: {solutions1}")
    print(f"Phương pháp Euclidean mở rộng: {solutions2}")
    
    for x in solutions1:
        print(f"Kiểm tra x = {x}: {a} * {x} ≡ {(a*x) % n} (mod {n}), đúng: {check_solution(a, x, b, n)}")
    
    # Test case 3: 2x ≡ 1 (mod 4) - vô nghiệm
    a, b, n = 2, 1, 4
    print(f"\nVí dụ 3: {a}x ≡ {b} (mod {n})")
    
    solutions1 = solve_linear_congruence(a, b, n)
    solutions2 = solve_using_extended_gcd(a, b, n)
    
    if not solutions1:
        print("Phương trình vô nghiệm")
    else:
        print(f"Nghiệm: {solutions1}")
```

## Ví dụ minh họa

### Ví dụ 1: $3x \equiv 2 \pmod{5}$

- $a = 3$, $b = 2$, $n = 5$
- $\gcd(3, 5) = 1$, và $2$ chia hết cho $1$, nên có nghiệm
- Nghịch đảo của $3$ modulo $5$: $3^{-1} \equiv 2 \pmod{5}$ (vì $3 \cdot 2 = 6 \equiv 1 \pmod{5}$)
- Nghiệm: $x \equiv 2 \cdot 2 \equiv 4 \pmod{5}$

### Ví dụ 2: $6x \equiv 9 \pmod{15}$

- $a = 6$, $b = 9$, $n = 15$
- $\gcd(6, 15) = 3$, và $9$ chia hết cho $3$, nên có nghiệm
- Rút gọn: $2x \equiv 3 \pmod{5}$
- Nghịch đảo của $2$ modulo $5$: $2^{-1} \equiv 3 \pmod{5}$
- Nghiệm cơ bản: $x' \equiv 3 \cdot 3 \equiv 4 \pmod{5}$
- Tất cả nghiệm: $x \equiv 4, 9, 14 \pmod{15}$

### Ví dụ 3: $2x \equiv 1 \pmod{4}$

- $a = 2$, $b = 1$, $n = 4$
- $\gcd(2, 4) = 2$, nhưng $1$ không chia hết cho $2$
- Phương trình vô nghiệm

## Ứng dụng

1. **Mã hóa RSA**: Giải phương trình đồng dư để tìm khóa giải mã
2. **Hệ thống số dư Trung Quốc**: Kết hợp nhiều phương trình đồng dư
3. **Lý thuyết số**: Nghiên cứu tính chất của số nguyên
4. **Thuật toán**: Giải các bài toán tối ưu với ràng buộc modular

## Độ phức tạp

- **Thời gian**: $O(\log \min(a, n))$ cho thuật toán Euclidean mở rộng
- **Không gian**: $O(1)$ không tính không gian lưu nghiệm

## Bài tập thực hành

1. [Codeforces - Linear Congruences](https://codeforces.com/)
2. [SPOJ - Linear Congruence](https://www.spoj.com/)
3. [AtCoder - Modular Equation](https://atcoder.jp/)

## Tài liệu tham khảo

1. Thomas H. Cormen, "Introduction to Algorithms"
2. Kenneth H. Rosen, "Elementary Number Theory"
3. [CP-Algorithms - Linear Congruence Equation](https://cp-algorithms.com/algebra/linear_congruence_equation.html)
4. Donald E. Knuth, "The Art of Computer Programming, Volume 2"